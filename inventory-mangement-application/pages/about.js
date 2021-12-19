import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function about() {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.grid}>
            <div>
              <h1>Welcome to MFWProject</h1>
              <p>Find in-depth information about Next.js features and API.</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
