import Image from "next/image";
import GutterlessList from "@/components/GutterlessList";

export default function Blog() {
  // Die Ihnalte für den Blog erstellen
  const myListItems = [
    {
      content: "Wir haben jetzt auch Mathe im Arsenal!",
      href: "/",
      imageUrl: "/Mathe.jpg",
    },
    {
      content: "AfD Wähler sind von unserer Plattform ausgeschlossen",
      href: "/",
      imageUrl: "/FckAfd.jpg",
    },
    {
      content: "Wilkommen zu unserer neuen Lernplattform: 'Triolingo'!",
      href: "/",
      imageUrl: "/Willkommen.jpg",
    },
  ];

  return (
    <>
      {/* Die Überschrift für den Blog erstellen */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            display: "flex",
            justifyContent: "center", // Die Überschrift soll mittig sein
            alignItems: "center",
            fontSize: "2rem",
            margin: "1%",
          }}
        >
          Blog
        </h1>
        <Image
          src="/rss-icon.png"
          alt="Icon für einen RSS-Feed"
          width={30}
          height={30}
        />
      </div>
      {/* Die GutterlessList Komponente für die Anzeige des Blogs verwenden*/}
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Die Blog-Einträge sollen auch zentriert sein
          alignItems: "center",
          width: "80%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Die MUI Komponente benutzen */}
        <GutterlessList items={myListItems} />
      </div>
    </>
  );
}
