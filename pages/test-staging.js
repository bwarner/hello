import Head from "next/head";
export default function Test() {
  return (
    <>
    <h1>Short Webform</h1>
    <iframe src="https://oncueco-staging.herokuapp.com/ks-moving-packing?iframe=1&mover_slug=ks-moving-packing&short=1" width="600" height="400">

    </iframe>

    <h1>Long Webform</h1>
    <iframe src="https://localhost:3000/ks-moving-packing?iframe=1&mover_slug=ks-moving-packing" width="600" height="400">

    </iframe>
    <h1>Blocked site (Expected)</h1>
    <iframe src="https://localhost:3000/admin" width="600" height="400">

    </iframe>
    </>
  );
}
