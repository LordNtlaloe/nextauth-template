import Navbar from "./_components/Navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return(
        <div className="w-screen h-screen flex flex-col gap-y-10 items-center justify-center">
            <Navbar />
            {children}
        </div>
    )
}

export default ProtectedLayout;