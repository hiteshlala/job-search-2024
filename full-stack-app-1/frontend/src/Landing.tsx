import { User } from './types';

type Props = {
  user: User | undefined;
}

export const Landing = ({ user }: Props) => {
  const { name, pets } = user || {};

  return !user ? null : (
    <div className="">
      <div>Landing</div>
      <div>{name}</div>
      {(pets || []).map((pet,j) => {
        return (
          <div key={`pet-${pet.id}-${j}`}>
            <div>{pet.name}</div>
            <div>{pet.description || 'no description'}</div>
            <div>{pet.age} years old</div>
            <div>{pet.images.map((img, i) => {
              return <img src={img} width="150px" key={`pet-${pet.id}-image-${i}`} />
            })}</div>
            <div></div>
          </div>
        );
      })}
    </div>
  );
};