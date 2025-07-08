import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useEffect} from "react";
import { createCategory, updateCategory } from "../../../../services/operations/categoryAPI"

export default function CategoryForm({ onSuccess, editData, setEditData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (editData) {
      setValue("name", editData.name)
      setValue("description", editData.description)
    } else {
      reset()
    }
  }, [editData])

  const onSubmit = async (data) => {
    const apiCall = editData
      ? () => updateCategory(editData._id, data)
      : () => createCategory(data)

    const res = await apiCall()
    if (res) {
      toast.success(`Category ${editData ? "updated" : "created"} successfully`)
      reset()
      setEditData(null)
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm text-richblack-5">Category Name</label>
        <input
          {...register("name", { required: true })}
          className="form-style w-full"
          placeholder="Enter category name"
        />
        {errors.name && <span className="text-pink-200 text-xs">Name is required</span>}
      </div>

      <div>
        <label className="text-sm text-richblack-5">Description</label>
        <textarea
          {...register("description")}
          className="form-style w-full"
          placeholder="Enter description"
        />
      </div>

      <div className="flex gap-4">
        <button type="submit" className="bg-yellow-50 text-black px-4 py-2 rounded-md">
          {editData ? "Update" : "Add"} Category
        </button>
        {editData && (
          <button onClick={() => { reset(); setEditData(null); }} className="text-richblack-300 underline">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  )
}
