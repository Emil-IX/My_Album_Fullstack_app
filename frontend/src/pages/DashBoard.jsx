
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [photos, setPhotos] = useState([]);
  const [randonPhoto, setRandonPhoto] = useState([])
  const [myPhotos, setMyPhotos] = useState([])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.get("/photos/public");
        const res = await api.get('/photos/my-photos')
        setPhotos(response.data);
        setMyPhotos(res.data)
        randonPictures(response.data, 4)
      } catch (error) {
        console.error("Error fetching public photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  const randonPictures = (arr, count = 2) => {
    if (!arr || arr.length == 0) {
      setRandonPhoto([])
      return
    }

    const photoSet = new Set()

    while (photoSet.size < count && photoSet.size < arr.length) {
      const randon = Math.floor(Math.random() * arr.length)
      photoSet.add(randon)
    }

    const selectedPhoto = Array.from(photoSet).map(i => arr[i])

    setRandonPhoto(selectedPhoto)
  }

  console.log(randonPhoto)

  return (
    <div>
      <div className=" bigContainer mt-7 p-6 bg-white  rounded shadow-md">
        <div className="welcome">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="welcome-w  mt-2">Welcome, <span>{user?.name}</span></p>
          <p className="welcome-r">Role: <span> {user?.role}</span></p>
        </div>

       <div  className="stadisNumber">
         <div className="usersPhotos--texts--numbers">
          <h3>Your pictures</h3>
          <p className="yourpictures">{myPhotos?.length}</p>
        </div>
        
        <div className="usersPhotos--texts--numbers">
          <h3>Global pictures</h3>
          <p>{photos?.length}</p>
        </div>
       </div>

      </div>

      {randonPhoto &&
        <div className="usersPhotos--container">

          <div className="usersPhotos">
            <div className="usersPhotos--img" >
              <img src={randonPhoto[0]?.imageUrl} alt={randonPhoto[0]?.name} />
            </div>

            <div className="usersPhotos--texts">
              <h3>Daily photo</h3>
              <p>{randonPhoto[0]?.title}</p>
              <p>{randonPhoto[0]?.comment}</p>
              <p>- {randonPhoto[0]?.author}</p>
            </div>
          </div>

          <div className="usersPhotos--container_litle">

            <div className="usersPhotos_litle">
              <div className="usersPhotos_litle-img" >
                <img src={randonPhoto[1]?.imageUrl} alt={randonPhoto[0]?.name} />
              </div>

              <div className="usersPhotos--texts_little">
                <p>{randonPhoto[1]?.title}</p>
                <p>{randonPhoto[1]?.comment}</p>
                <p>- {randonPhoto[1]?.author}</p>
              </div>
            </div>

            <div className="usersPhotos_litle">
              <div className="usersPhotos_litle-img" >
                <img src={randonPhoto[2]?.imageUrl} alt={randonPhoto[0]?.name} />
              </div>

              <div className="usersPhotos--texts_little">
                <p>{randonPhoto[2]?.title}</p>
                <p>{randonPhoto[2]?.comment}</p>
                <p>- {randonPhoto[2]?.author}</p>
              </div>
            </div>

            <div className="usersPhotos_litle">
              <div className="usersPhotos_litle-img" >
                <img src={randonPhoto[3]?.imageUrl} alt={randonPhoto[0]?.name} />
              </div>

              <div className="usersPhotos--texts_little">
                <p>{randonPhoto[3]?.title}</p>
                <p>{randonPhoto[3]?.comment}</p>
                <p>- {randonPhoto[3]?.author}</p>
              </div>
            </div>

          </div>

        </div>
      }

    </div>
  );
};

export default Dashboard;
