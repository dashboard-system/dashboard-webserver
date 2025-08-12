import {
  FlightTracking,
  useA429ValuesSimulator,
} from 'a429-flight-display'

function Landing() {
  const a429Data = useA429ValuesSimulator()
  return (
    <>
      <FlightTracking  apiKey="AIzaSyC1NON_9qpto6k0JaptLjTsxFQO_KYMPks" flightData={a429Data}/>
    </>
  )
}

export default Landing
