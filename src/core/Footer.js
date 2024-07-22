export default function Footer() {
    return (
        <footer>
            <nav className="navbar-dark"
                style={{ background: "black" }}>
                <div className='p-1 text-center' >
                    &copy; {new Date().getFullYear()} Games AI
                    <br />
                    mvignesh@iitdalumni.com &nbsp;&nbsp; +1-858-518-9851
                </div>
            </nav>
        </footer>
    );
}