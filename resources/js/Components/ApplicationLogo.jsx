export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/logo.svg" 
            alt="Application Logo"
            className={props.className} // Apply passed className
            style={{ ...props.style }} // Apply passed styles
        />
    );
}
