
import { UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';


function UserControl() {

    const { user, logout } = useAuth();
    const [miniModal, setMiniModal] = useState(false)

    const cutText = (text) => {
        const space = text.indexOf(' ')

        if (space !== -1) {
            return text.slice(0, space)
        }

        return text
    }

    const openMiniModal = () => {
        setMiniModal(!miniModal)

    }



    return (
        <div className='userControlContainer'>
            <div className='userControl'>
                <p>Hello, {cutText(user.name, 10)}</p>
                <UserCircle onClick={() => openMiniModal()} />
            </div>
            {miniModal &&
                <div 
                className ='miniModalClose' 
                onClick={()=> logout()}
                >
                    <p>Log Out</p>
                </div>
            }
        </div>
    )
}

export default UserControl