import { Outlet,Link } from 'react-router-dom';

function RootLayout({library, setLibrary}){
    return(
        <div>
            <nav>
                <Link to="/">Home</Link>
                <Link to = "/library">Library</Link>
            </nav>
            <Outlet context = {{library, setLibrary}}/>
        </div>
        
    );
}
export default RootLayout;