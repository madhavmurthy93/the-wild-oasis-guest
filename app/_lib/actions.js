"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest,
} from "./data-service";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuestProfileAction(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const nationalID = formData.get("nationalID");
  const x = formData.get("nationality");
  const [nationality, countryFlag] = x.split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID number.");
  }

  const updateData = { nationality, countryFlag, nationalID };
  const data = await updateGuest(session.user.guestId, updateData);

  revalidatePath("/account/profile");
}

export async function createBookingAction(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests,
    observations: observations.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    hasBreakfast: false,
    isPaid: false,
    status: "unconfirmed",
  };

  const data = await createBooking(newBooking);

  revalidatePath("/account/reservations");
  redirect("/cabins/thankyou");
}

export async function updateBookingAction(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const bookingId = Number(formData.get("bookingId"));
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to update this booking");

  const data = await updateBooking(bookingId, {
    numGuests,
    observations: observations.slice(0, 1000),
  });

  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}

export async function deleteBookingAction(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking");

  const data = await deleteBooking(bookingId);

  revalidatePath("/account/reservations");
}
