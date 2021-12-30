import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href='#'>
            <time>12 de abril de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspace</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared...</p>
          </a>
          <a href='#'>
            <time>12 de abril de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspace</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared...</p>
          </a>
          <a href='#'>
            <time>12 de abril de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspace</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared...</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ],{
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  })

  // DEBUG console.log(JSON.stringify(response, null, 2))
  
  return {
    props: {}
  }
}
