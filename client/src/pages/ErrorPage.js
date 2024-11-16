import React from 'react';

const ErrorPage = () => {
  return (
    <section className=" h-screen flex flex-col">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center gap-4">
          <h1 className="mb-4 text-9xl lg:text-[15rem] tracking-tight font-extrabold  text-primary-600">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-slate-500 md:text-4xl">
          The page you are looking for doesn't exist or has been moved. Please go back to the homepage.
          </p>
          <a href="#"  className="m-8 cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]" >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
