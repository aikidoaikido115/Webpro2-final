import { Button } from 'antd';
import 'antd/dist/reset.css';  // Import Ant Design styles

const AntButton = ({ label, type = 'primary', size = 'middle', onClick, disabled = false }) => {
    return (
        <Button type={type} size={size} onClick={onClick} disabled={disabled}>
            {label}
        </Button>
    );
};

export default AntButton;