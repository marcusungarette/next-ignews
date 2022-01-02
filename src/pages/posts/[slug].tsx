import { GetServerSideProps } from 'next';
import Head from 'next/head'
import PrismicDom from 'prismic-dom'
import { getSession } from 'next-auth/react';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss'

interface PostsProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostsProps) {
  return (
    <>
    <Head>
      <title>{post.title} | Ignews</title>
    </Head>

    <main className={styles.container}>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>{post.updatedAt}</time>
        <div 
        dangerouslySetInnerHTML={{ __html: post.content }}
        className={styles.postContent}
        />
      </article>
    </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  console.log(session)
  
  const { slug } = params;

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID('post', String(slug), {})
  
  const post = {
    slug,
    title: PrismicDom.RichText.asText(response.data.title),
    content: PrismicDom.RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  return {
    props: {
      post
      }
    }
  }