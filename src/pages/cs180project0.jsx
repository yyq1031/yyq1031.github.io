const CS180Proj0 = () => {
    return(
        <div>
            <h1>Project 0</h1>
            <h2>Part 1: Selfie: The Wrong Way vs. The Right Way</h2>
            <div className="photo-row">
                <div className="photo">
                    <img src="/nozoom.png" alt="No zoom, close up" />
                    <p>No zoom, close up</p>
                </div>
                <div className="photo">
                    <img src="/zoomedin.png" alt="Zoomed in, far away" />
                    <p>Zoomed in, far away</p>
                </div>
                {/* <div>
                    <p>Placing camera very close to the face with no zoom makes the facial features closer to camera appear much larger and features further away appear smaller as phone camera exaggerates the depth of different facial features.</p>
                </div> */}
            </div>
            <h2>Part 2: Architectural Perspective Compression</h2>
            <div className="photo-row">
                <div className="photo">
                    <img src="/streetnozoom.png" alt="No zoom, close up" />
                    <p>No zoom, close up</p>
                </div>
                <div className="photo">
                    <img src="/streetzoomedin.png" alt="Zoomed in, far away" />
                    <p>Zoomed in, far away</p>
                </div>
            </div>
            <h2>Part 3: The Dolly Zoom</h2>
            <div className="photo">
                <img src="/oncampus.gif" alt="the dolly zoom on campus" />
                <p>Enjoying the view on campus</p>
            </div>
            <div className="photo">
                <img src="/inapt.gif" alt="the dolly zoom in my apartment" />
                <p>Enjoying the view in my apartment</p>
            </div>
        </div>
    )
}
export default CS180Proj0;