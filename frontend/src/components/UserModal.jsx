export default function UserModal({ formInformation, onChangeInputs, updateUser, closeModal, error }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4 text-blue-800">Edit User</h3>
        <form onSubmit={updateUser} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formInformation.name}
            onChange={onChangeInputs}
            placeholder="Name"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            type="text"
            name="role"
            value={formInformation.role}
            onChange={onChangeInputs}
            placeholder="Role"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            type="date"
            name="age"
            value={formInformation.age}
            onChange={onChangeInputs}
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            value={formInformation.email}
            onChange={onChangeInputs}
            placeholder="Email"
            className="w-full p-2 border rounded border-gray-500 text-gray-500"
            disabled
          />
          {error && <p className="py-1 px-2 text-red-500 bg-red-100 rounded">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="text-white px-4 py-2 bg-gray-500 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-4 py-2 bg-blue-400 rounded hover:bg-blue-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
