import { ChangeEvent, useEffect, useState } from 'react';
import { Pet, User } from './types';
import { Pencil } from './Pencil';
import logo from './assets/icon.png';

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
  const [petImg, setPetImg] = useState<File>();


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
    setPetImg(undefined);
  };

  const updatePet = async () => {
    const body = new FormData();
    body.append('name', petName );
    body.append('age', `${age}`);
    body.append('description', description);
    if (petImg) {
      body.append('image', petImg);
    }
    
    fetch(
      `/api/pet/${editing}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        },
        body,
      }
    )
    .then(r => r.json())
    .then(() => {
      cancelUpdate();
      return refetchUser();
    })
    .catch(console.error);
  };

  const addImgFile = (event: ChangeEvent<HTMLInputElement>) => {
    if( event.target.files && event.target.files[0]) {
      setPetImg(event.target.files[0]);
    }
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
              {(editing !== pet.id) && <div>
                <div> 
                  {!!pet.image && <img src={pet.image} width="150px" />}
                  {!pet.image && <img src={logo} width="150px" height="150px"/>}
                </div>
                <div><b>{pet.name}</b></div>
                <div>{pet.description || 'no description'}</div>
                <div>{pet.age} years old</div>
                <button className='pet-edit-button' onClick={editPet}><Pencil width='12px' /></button>
              </div>}
              {(editing === pet.id) && <div>
                <div>
                  <div className='image-upload-dropzone'>
                    <input type="file" id="file" accept="*" onChange={addImgFile} multiple={false}/>
                  </div>
                </div>
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