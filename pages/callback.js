export const getServerSideProps = async (ctx) => {
 console.log('ctx is ', ctx);
  return {
    props:{
      data:{
        query: ctx.query
      },
    }
  }
}

const Callback = (props) => {
  const { data: { query } } = props;
  return (
    <>
      <h1>Query</h1>
      <div>
        <code>
          {query && JSON.stringify(query, null, 2)}
        </code>
      </div>
    </>
  );
}

export default Callback;