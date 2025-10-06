import { Edit, Trash2 } from "lucide-react";

export default function UsersTable({ data, deleteUser, openEditModal }) {
  return (
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
                onClick={() => deleteUser(_id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
