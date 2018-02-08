Filmkezelő
==========

Film nyilvántartó webalkalmazás memória-alapú (in-memory) adatbázis back-enddel Angular.js környezetben fejlesztve.

# Az alkalmazás elindítása

A front-end és a back-end szerver Node.js segítségével indítható el `node server` (linuxnál: `nodejs server`) parancs kiadásával. A front-end szervert alapértelmezetten a **80**-as porton érhetjük el, a back-end pedig a **3000**-es porton fut.

# Felépítés és használat

## Back-end

A back-end szerver az adatok perzisztens tárolásávat végzi, ami egy egyszerű memória-alapú *NeDB* nevű adatbáziskezelő modullal történik. Az adatbázis a gyökérkönyvtárban elhelyezkedő `database.db` nevű fájlban található.

A front-end szerverrel JSON formátumba csomagolt JavaScript objektumokkal kommunikál a feladat típusa és az érintett tábla neve alapján kialakított végpontokon. A feladatok az alábbiak lehetnek:
+ backup (biztonsági mentés, exportálás CSV-be)
+ létrehozás
	* film (*entry* vagyis bejegyzés) és ennek altáblái:
		- komment (*comment*)
		- címke vagy *tag*
		- tárolási hely (*location*)
+ szerkesztés
	* filmbejegyzés és komment szerkeszthető
+ törlés
	* az összes táblára van végpont

A szkript fájlok a `routes/` könyvtárban helyezkednek el. 

## Front-end

Az Angular.js framework-öt használó front-end szolgálja ki a felhasználót. Jelenleg a következő funkciók állnak rendelkezésre:
+ film létrehozása, szerkesztése, törlése
+ film szerkesztésénél:
	* tag-ek és tárolási helyek hozzáadása, eltávolítása listába szedett gombokkal
		- a felvett tag-ek az alapértelmezettől eltérő színben jelennek meg a listában
		- a népszerű tag-eket aláhúzással és félkövér betűvel kiemeli a program
		- új tag-et vagy tárolási helyet a gomblista alatti mezőben vehetünk fel
+
+
+
+

A front-end szerver fájljai a `public/` könyvtárban helyezkednek el, ezen belül a `filters/` tartalmazza a keresési, szűkítési és rendezési szűrőket, a `modals/` pedig a dialógusablakok sablonjait és vezérlőszkriptjeit. 

## Az adatbázis visszaállítása importált adatokból

Az adatbázis visszaállítása a `database.db` kitörlésével, majd a reset_db.js Node.js-sel való lefuttatásával lehetséges. Az ehhez szükséges táblaneveket viselő CSV fájlokat az `import_data` könyvtárban kell elhelyezni.

Ez a funkció fokozott elővigyázatosságot igényel, mert könnyedén adatvesztést okozhat.