

export default function CreateUser() {



  return (
    <div>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10   ">
        <h2 className="text-xl font-bold text-blue-500 ">Create User</h2>

        <form className="space-y-4 mt-4"> 
             <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
             <input
            type="text"
            name="email"
            placeholder="email"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
             <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
             <input
            type="date"
            name="date"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

              <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
              <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm password"
            className="w-full p-2 border rounded border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          <button
          type="submit"
            className="text-white px-4 py-2 bg-blue-400 rounded hover:bg-blue-500"
          >
            Create User
          </button>

        </form>
        </div>

    </div>
  )
}
