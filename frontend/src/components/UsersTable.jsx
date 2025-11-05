import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function UsersTable({ data, deleteUser, openEditModal }) {

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [idSelected, setidSelected] = useState(null)

  const openModalSentId = (id) => {
    setModalDeleteOpen(true)
    setidSelected(id)
  }


  const eliminateItem = () => {
    deleteUser(idSelected)
    setModalDeleteOpen(false)
  }



  return (
    <>
      <table className=" bg-white min-w-full  divide-y divide-gray-200 rounded shadow-md">
        <thead className="bg-blue-900">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Birth Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map(({ _id, name, role, age, email }) => (
            <tr key={_id} className="hover:bg-blue-100 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">{name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{role}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{age.split("T")[0]}</td>
              <td className="px-6 py-4 flex justify-center gap-3">
                <button
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                  onClick={() => openEditModal({ _id, name, role, age, email })}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  onClick={() => openModalSentId(_id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalDeleteOpen &&
        <div className="deleteModalOpen_bg" >
          <div className="deleteModalOpen">
            <div  className="deleteModalOpen_texts">
              <h3>Delete user</h3>
              <p>¿Are you sure to delete this user?</p>
            </div>
            <div className="buttons">
              <button
                type="button"
                onClick={ eliminateItem }
              >
                Confirm
              </button>

              <button
                type="button"
                onClick={() => setModalDeleteOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      }
    </>

  );
}
