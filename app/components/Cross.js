import Image from "next/image";
 const Cross = ({pos}) => {
  return (
    <div className={`cross ${pos}`}>
      <Image
        src="/cross.svg"
        alt="Cross"
        width={20}
        height={20}
        priority
      />
    </div>
  )
}

export default Cross;