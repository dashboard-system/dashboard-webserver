import { useA429ValuesSimulator, AircraftPFD } from 'a429-flight-display'

function A429() {
  const a429Data = useA429ValuesSimulator()
  return (
    <>
      <AircraftPFD flightData={a429Data} />
    </>
  )
}

export default A429
