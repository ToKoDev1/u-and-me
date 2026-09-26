---
name: ux-copy-refiner
description: Optimiert Microcopy in Formularen, Buttons, Modals und Fehlermeldungen, wenn UI-Texte klarer werden sollen oder Abbrüche an verwirrenden Texten liegen.
---

Dieser Skill überarbeitet UI-Texte so, dass Nutzer ohne Nachdenken verstehen, was passiert und was sie tun sollen.

## Wann dieser Skill aktiviert wird
- Jemand bittet darum, Formulartexte, CTAs oder Fehlermeldungen verständlicher zu machen.
- Ein Flow wie Anmeldung oder Checkout hat hohe Abbruchraten und die Texte sollen als Ursache geprüft werden.
- Beim Bauen oder Reviewen von UI fallen generische Strings auf wie "Absenden" oder "Ungültige Eingabe".

## Workflow
1. Alle Strings des Flows in einer Tabelle erfassen: Element-Typ (Button, Label, Placeholder, Helper, Error, Modal, Empty State), aktueller Text, Kontext.
2. Tonalität festlegen: Du oder Sie aus den Bestandstexten ableiten, feste Begriffe in einem Mini-Glossar notieren. Konflikte als offene Frage markieren statt raten.
3. Buttons und CTAs: Verb zuerst, Ergebnis des Klicks benennen ("Demo anfordern" statt "Absenden"), 2 bis 4 Wörter, nie "OK", "Senden" oder "Hier klicken".
4. Labels und Helper-Texte: Label als kurzes Substantiv, Helper beantwortet "Wozu braucht ihr das?" oder zeigt das Format. Placeholder nur für Formatbeispiele, nie als Label-Ersatz, weil er beim Tippen verschwindet.
5. Fehlermeldungen nach der Dreier-Formel: was passiert ist (Klartext), was der Nutzer jetzt tut, optional warum. Keine Schuldzuweisung, keine nackten Fehlercodes.
6. Modals: Titel nennt die Konsequenz ("Entwurf verwerfen?"), Buttons wiederholen die Aktion ("Verwerfen" / "Weiter bearbeiten"), nie zwei vage Optionen.
7. Empty States erklären, warum hier nichts ist, und bieten genau eine nächste Aktion an.
8. Konsistenz-Pass: ein Begriff pro Konzept, eine Anredeform, eine Schreibweise.
9. Laut-Lese-Test: Füllwörter streichen, Kerninformation an den Satzanfang ziehen.

## Output-Format
Markdown-Tabelle mit vier Spalten: Element, Vorher, Nachher, Begründung (ein Satz). Danach offene Fragen (Tonalität, Rechtliches, fehlender Kontext) und das Mini-Glossar. Bei mehr als 20 Strings nach Screens gruppieren.

## Qualitätsregeln
- Jeder Button beginnt mit einem Verb und benennt das Ergebnis des Klicks.
- Keine Fehlermeldung ohne konkreten nächsten Schritt.
- Placeholder enthalten nie Pflichtinformationen.
- Ein Konzept hat im gesamten Flow genau ein Wort, keine Synonym-Variation.
- Die Anredeform ist in allen Strings identisch.
- Fachjargon und Fehlercodes nur mit Klartext-Erklärung daneben.
- Helper-Texte sind maximal ein Satz.

---


## Anpassung für U & Me (hat Vorrang)

Hier geht es nicht um Conversion oder Abbruchraten, sondern darum, dass sich Eltern verstanden und beruhigt fühlen.
- Anrede **„ihr“** (Eltern als Paar/Familie) – das ist der Bestand. Abweichungen („du“, „Sie“) aufspüren und angleichen.
- Tonalität: deutsch, freundlich-sachlich, beruhigend. Keine Ausrufezeichen-Häufung, kein Marketing.
- Entwicklung **immer als Spannbreite**, nie als Stichtag („meist zwischen … und …“). Keine Diagnosen, keine Bewertung des Kindes, keine Vergleiche mit „normal“.
- Inhaltliche Texte (Phasen, Etappen, U-Untersuchungen) liegen in `src/content/*.json` und nennen ihre Quelle – beim Umformulieren den fachlichen Inhalt nicht verändern; bei Unsicherheit markieren statt raten.
- Kein „Sprünge“-Vokabular (Wonder Weeks o. ä.), stattdessen „Etappen“.
