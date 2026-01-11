import Card from "./Card";

export default function MainListCard() {
    const result = true;
  return (
    <div>
        {result ? <Card /> : <p>No result found</p>}
        </div>
  )
}
