import Head from "next/head";
export default function Test() {
  return (
    <>
    <h1>Short Webform</h1>
    <iframe src="http://localhost:3000/a-growth-company?iframe=1&mover_slug=a-growth-company&short=1" width="600" height="400">

    </iframe>

    <h1>Long Webform</h1>
    <iframe src="http://localhost:3000/a-growth-company?iframe=1&mover_slug=a-growth-company" width="600" height="400">

    </iframe>
    <h1>Blocked site (Expected)</h1>
    <iframe src="http://localhost:3000/admin" width="600" height="400">

    </iframe>
    </>
  );
}
