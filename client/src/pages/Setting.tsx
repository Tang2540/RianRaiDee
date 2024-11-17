import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useAuth } from "../utils/Auth/useAuth";

function Setting() {
  const [displayName, setDisplayName] = useState("");

  const { user, checkAuthStatus } = useAuth();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append("image", selectedFile); // Use selectedFile directly instead of file state

      checkAuthStatus();
      if (user) {
        try {
          const res = await axios.post(
            "http://localhost:3000/upload",
            formData
          );
          if (res.data.Status === "Success") {
            console.log("succeed");
          } else {
            console.error("Upload failed");
          }
        } catch (error) {
          console.error("Error during upload:", error);
        }
      }
    }
  };

  const handleNameChange = async () => {
    checkAuthStatus();
    if (user) {
      try {
        await axios.post("http://localhost:3000/changeName",displayName)
        .then(res=>{
          setDisplayName("")
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="card bg-primary text-primary-content w-full md:mt-8">
          <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-y-6">
            <h2 className="card-title col-span-4">Profie editting</h2>
            <div className="whitespace-nowrap">
              <img
                alt={user?._id}
                src={
                  user?.googleId
                    ? user?.picture
                    : "http://localhost:3000/images/" + user?.picture
                }
                className="w-40 rounded-full mb-1"
              />
              <div className="relative inline-block">
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
                  <span className="font-medium text-sm">Choose Image</span>
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="flex flex-row gap-2">
                <div className="form-control w-[50%]">
                  <label className="label">
                    <span className="label-text">ชื่อใหม่</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ชื่อใหม่"
                    className="input input-bordered"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                    required
                  />
                  <button className="btn btn-outline w-1/3" onClick={handleNameChange}>เปลี่ยนชื่อ</button>
                </div>
              </div>
            </div>

            <div>
              <button
                className="btn btn-error"
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_3"
                  ) as HTMLDialogElement;
                  modal.showModal();
                }}
              >
                <span className="material-symbols-outlined">delete</span>
                ลบบัญชีผู้ใช้งาน
              </button>
            </div>
          </div>
        </div>
      </div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            คุณต้องการลบบัญชีนี้ของคุณใช่หรือไม่
          </h3>
          <div className="flex gap-8 justify-center mt-4">
            <button>ยืนยัน</button>
            <button>ยกเลิก</button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Setting;
