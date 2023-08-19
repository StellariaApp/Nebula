import Image from "next/image";
import "./page.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin-ext"] });

const Page = () => {
  return (
    <main className={inter.className}>
      <div className="shape-1"></div>
      <div className="shape-2"></div>
      <div className="shape-3"></div>
      <hr className="line line-1"></hr>
      <hr className="line line-2"></hr>
      <hr className="line line-3"></hr>
      <hr className="line line-4"></hr>
      <section>
        <Image
          src="/images/logo-nebula.png"
          alt="Nebula Logo"
          width={160}
          height={60}
        />
        <h1>Comming Soon</h1>

        <div className="powered-by">
          Powered by{" "}
          <a href="https://stellaria.app" target="_blank">
            <Image
              src="/images/logo-stellaria.png"
              alt="Nebula Logo"
              width={90}
              height={20}
            />
          </a>
        </div>
      </section>
    </main>
  );
};

export default Page;
