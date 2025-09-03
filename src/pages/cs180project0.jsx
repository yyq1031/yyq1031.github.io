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
                    <img src="/buildingnozoom.png" alt="No zoom, close up" />
                    <p>No zoom, close up</p>
                </div>
                <div className="photo">
                    <img src="/buildingzoomedin.png" alt="Zoomed in, far away" />
                    <p>Zoomed in, far away</p>
                </div>
            </div>
            <h2>Part 3: The Dolly Zoom</h2>
            <div className="photo">
                <img src="/lamppost.gif" alt="dolly zoom lamppost" />
                <p>lamppost</p>
            </div>
        </div>
    )
}
export default CS180Proj0;