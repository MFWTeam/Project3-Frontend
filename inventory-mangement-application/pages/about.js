import Layout from "../components/Layout";
import styles from "../styles/About.module.css";

export default function about() {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.grid}>
            <div>
              <h1>Welcome to MFWProject</h1>
              <hr />
              <h5>
                It is a system specialized in managing and controlling all
                distribution operations and various warehouse activities in an
                easy and flexible way that can be customized and structured
                according to the requirements and volume of activity. Our
                program provides an integrated system to manage an important and
                essential part of the activity of any company of different size
                and nature of work.
              </h5>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
