import image1 from '../assets/images/mc.svg'
import image2 from '../assets/images/visa.svg'

const Footer = () => {
    return (
        <div className=" flex flex-col justify-center items-center w-full mt-5 text-gray-300 text-[13px]">
            <div className="flex w-full items-center justify-evenly mt-8 text-gray-300 text-[13px]">
                <div className="max-w-[400px] text-[13px]">
                    Your solution for fast, secure, and convenient money transfers. Send and receive funds instantly with Interlan Transfers.
                    - Interlan currently is in development, soon to be operational.
                    Experience the future of seamless fund transfers with our intuitive and reliable platform, coming soon."
                </div>
                <div className="flex gap-3">

                    <div className="flex flex-col ">
                        <p className="mb-3 text-[12px] hover:text-blue-500 cursor-pointer">Cookies Policy</p>
                        <img src={image1} alt="mastercard" />
                    </div>

                    <div className="flex flex-col">
                        <p className="mb-3 text-[12px] hover:text-blue-500 cursor-pointer">Terms and conditions</p>
                        <img src={image2} alt="visa" />
                    </div>
                </div>
            </div>

            <div className="text-gray-300 text-[12px] mt-5">
                © Interlan 2023
            </div>
        </div>
    )
}

export default Footer