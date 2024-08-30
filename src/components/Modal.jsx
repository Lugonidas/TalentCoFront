export default function Modal({ children }) {

    return (
        <div className="z-10 transition-all ease duration-1000 fixed top-0 left-0 bottom-0 right-0 p-8 bg-[rgba(255,255,255,0.5)] backdrop-blur h-full overflow-hidden overflow-y-scroll">
            <div className={`absolute w-3/4 mx-auto left-0 right-0`}>
                {children}
            </div>
        </div>
    )
}
