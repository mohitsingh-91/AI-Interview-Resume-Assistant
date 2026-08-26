import { useState, useRef, useEffect } from 'react';
import './userMenu.scss';
import { useAuth } from '../../features/auth/hooks/useAuth';

const getInitials = (user) => {
    const source = user?.username || user?.email || '';
    if (!source) return '?';
    const parts = source.trim().split(/\s+/);
    if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
};

const UserMenu = () => {
    const { user, handleLogout } = useAuth();
    const [ open, setOpen ] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onLogout = async () => {
        setOpen(false);
        await handleLogout();
    };

    if (!user) return null;

    return (
        <div className='user-menu' ref={menuRef}>
            <button
                className='user-menu__avatar'
                onClick={() => setOpen(o => !o)}
                aria-label='Account menu'
            >
                {getInitials(user)}
            </button>

            {open && (
                <div className='user-menu__dropdown'>
                    <div className='user-menu__info'>
                        <p className='user-menu__name'>{user.username || 'User'}</p>
                        {user.email && <p className='user-menu__email'>{user.email}</p>}
                    </div>
                    <div className='user-menu__divider' />
                    <button className='user-menu__logout' onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;