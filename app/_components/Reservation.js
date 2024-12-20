import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

async function Reservation({ cabin }) {
  const { id, name, maxCapacity } = cabin;
  const bookedDates = await getBookedDatesByCabinId(id);
  const settings = await getSettings();
  const session = await auth();
  return (
    <div>
      <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
        Reserve {name} today. Pay on arrival.
      </h2>
      <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
        <DateSelector bookedDates={bookedDates} settings={settings} cabin={cabin} />
        {session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />}
      </div>
    </div>
  );
}

export default Reservation;
