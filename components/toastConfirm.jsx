import { toast } from "react-toastify"

export function toastConfirm(message) {
    return new Promise((resolve) => {
        const ToastContent = () => (
            <div className="toast-container">
                <span>{message}</span>
                <div className="con">
                    <button
                        onClick={() => {
                            resolve(true)
                            toast.dismiss() // close toast
                        }}
                        className="accept"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => {
                            resolve(false)
                            toast.dismiss() // close toast
                        }}
                        className="reject"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )

        toast(<ToastContent />, {
            autoClose: true, // wait until user clicks
            closeOnClick: true,
            closeButton: false,
            position: "bottom-center",
            draggable: true,
        })
    })
}
