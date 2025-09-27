import { Link } from "react-router-dom";

const CS180 = () => {
    return(
        <div>
            <h1>Welcome to my CS180 Project Gallery!</h1>
            <p><Link to="/cs180/project0">Project 0</Link></p>
            <p><Link to="/cs180/project1">Project 1</Link></p>
            <p><Link to="/cs180/project2">Project 2</Link></p>
        </div>
    )
}
export default CS180;