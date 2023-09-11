import IndentedTree from "@/app/components/IndentedTree";
import { enhancedDummyDataTwo } from "@/app/dummyData";

type Props = {
  params: {
    specialtyId: string;
  };
};

export default function specialtyId(props: Props) {
  console.log(props.params.specialtyId);

  const specificSpecialtyData = enhancedDummyDataTwo.find(
    (specialty) => specialty.id.toString() === props.params.specialtyId
  );

  console.log(specificSpecialtyData);

  return (
    <main>
      <IndentedTree data={specificSpecialtyData} />
    </main>
  );
}
