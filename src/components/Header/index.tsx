import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink'
import { useRouter } from 'next/router'
export const config = { amp: true }
export function Header() {
    const router = useRouter()
    const date = new Date()
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="Logo" />
                <nav>
                    <ActiveLink activeClassName={styles.active} href='/' >
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href='/posts'>
                        <a> Posts</a>
                    </ActiveLink>
                    {/* <button onClick={()=>router.push('/posts')}>Ok</button> */}

                </nav>
                <SignInButton />
            </div>
        </header>
    )
}

export default Header