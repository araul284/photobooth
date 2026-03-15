function DoodleFrame({ children }) {
    
    return (

        <div className="relative w-72 h-72">

            <svg
                viewBox="0 0 300 300"
                className="absolute w-full h-full"
           >
                <path
                    d="
                    M20 20
                    Q40 10 80 20
                    Q150 30 220 20
                    Q280 40 270 80
                    Q260 150 270 220
                    Q260 270 220 260
                    Q150 250 80 260
                    Q40 270 20 230
                    Q10 150 20 30
                    "
                    fill="none"
                    stroke="#ff7aa2"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                
            </svg>

            <div className="absolute inset-6 overflow-hidden rounded-[30px]">

                {children}

            </div>

        </div>

    )

}

export default DoodleFrame