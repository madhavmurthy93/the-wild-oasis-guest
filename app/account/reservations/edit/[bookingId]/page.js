import UpdateReservationForm from "@/app/_components/UpdateReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const booking = await getBooking(params.bookingId);
  return {
    title: `Edit Reservation #${booking.id}`,
  };
}

export default async function Page({ params }) {
  const booking = await getBooking(params.bookingId);
  const cabin = await getCabin(booking.cabinId);
  const { id: reservationId } = booking;
  const { maxCapacity } = cabin;
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <UpdateReservationForm booking={booking} maxCapacity={maxCapacity} />
    </div>
  );
}
