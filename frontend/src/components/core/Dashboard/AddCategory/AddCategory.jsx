import { useEffect } from "react"
import CategoryForm from "./CategoryForm"

export default function AddCategory() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex w-full items-start gap-x-6">
      
      {/* Main Add Category Area */}
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Add Category
        </h1>

        <div className="flex-1">
          <CategoryForm />
        </div>
      </div>

      {/* Upload Tips Sidebar */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="mb-8 text-lg text-richblack-5">📚 Category Creation Tips</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>Choose a clear and concise name for the category.</li>
          <li>Provide a short description to clarify the category purpose.</li>
          <li>Categories help organize and filter your courses efficiently.</li>
          <li>Try not to duplicate existing categories unless necessary.</li>
          <li>Keep it broad but relevant, like "Web Development", "Marketing", etc.</li>
        </ul>
      </div>
    </div>
  )
}
