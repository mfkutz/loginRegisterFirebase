import { Link } from 'react-router-dom'

const SettingMenu = ({ option }) => {

    return (
        <div className="flex flex-row mt-7 gap-6 text-gray-500 border-b-[1px] border-gray-700">
            <Link
                to={'/settings/profile'}
                className={`uppercase hover:text-gray-300 cursor-pointer btn py-1 ${option === 'Profile' ? 'selected' : ''}`}
            >Profile
            </Link>
            <Link
                to={'/settings/methods'}
                className={`uppercase hover:text-gray-300 cursor-pointer btn py-1  ${option === 'Methods' ? 'selected' : ''}`}
            >Methods
            </Link>
        </div>
    )
}

export default SettingMenu