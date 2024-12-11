import { Pet, User } from './types';
import { Pencil } from './Pencil';
import { useEffect, useState } from 'react';

type Props = {
  user: User | undefined;
  refetchUser: () => Promise<void>;
}

export const Landing = ({ user, refetchUser }: Props) => {
  const { pets } = user || {};
  const [dispPets, setDispPets] = useState<Pet[]>([]);
  const [editing, setEditing] = useState<number>(-1);
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState('');
  const [petName, setPetName] = useState('');


  useEffect(() => {
    if (pets) {
      const nextPets = [...pets].sort((a, b) => {
        if (a.id < b.id) return 1;
        if (a.id > b.id) return -1;
        return 0;
      });
      setDispPets(nextPets);
    } else {
      setDispPets([]);
    }
  }, [pets]);

  const cancelUpdate = () => {
    setEditing(-1);
    setAge(0);
    setDescription('');
    setPetName('');
  };

  const updatePet = async () => {
    console.log('update pet');
    fetch(
      `/api/pet/${editing}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: petName,
          age,
          description,
        }),
      }
    )
    .then(r => r.json())
    .then(() => {
      cancelUpdate();
      return refetchUser();
    })
    .catch(console.error);
  };

  return !user ? null : (
    <div className="pets">
      <h2>My Pets</h2>
      <div className='pets-wrapper'>
        {dispPets.map((pet, j) => {
          const editPet = () => {
            setEditing(pet.id);
            setAge(pet.age || 0);
            setDescription(pet.description || '');
            setPetName(pet.name);
          };
          return (
            <div key={`pet-${pet.id}-${j}`} className='pets-card'>
              <div>{
                pet.images.map((img, i) => {
                  return <img src={img} width="150px" key={`pet-${pet.id}-image-${i}`} />
                })
              }</div>
              {(editing !== pet.id) && <div>
                <div><b>{pet.name}</b></div>
                <div>{pet.description || 'no description'}</div>
                <div>{pet.age} years old</div>
                <button className='pet-edit-button' onClick={editPet}><Pencil width='12px' /></button>
              </div>}
              {(editing === pet.id) && <div>
                <div><input type="text" onChange={(e) => setPetName(e.target.value)} value={petName} placeholder='Pets Name'/></div>
                <div><textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder='Describe pets cuteness..'/></div>
                <div><input type="number" onChange={(e) => setAge(parseInt(e.target.value))} value={`${age || 0}`} placeholder='Pets age' /></div>
                <button className='' onClick={cancelUpdate}>Cancel</button>
                <button className='' onClick={updatePet}>Update</button>
              </div>}
            </div>
          );
        })}
      </div>
      
    </div>
  );
};