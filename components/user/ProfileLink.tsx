import Image from "next/image";
import Link from "next/link";

interface Props {
  imgUrl: string;
  href?: string;
  title: string;
}

const ProfileLink = ({ imgUrl, href, title }: Props) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt={title} width={20} height={20} />

      {href ? (
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
      ) : (
        <p>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
