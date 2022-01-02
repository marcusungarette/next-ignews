import { GetStaticProps } from 'next';
import Head from 'next/head'
import PrismicDom from 'prismic-dom'
import { getPrismicClient } from '../../../services/prismic';
import styles from '../post.module.scss'

interface PostsPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostsPreviewProps) {
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
        className={`${styles.postContent} ${styles.previewContent}`}
        />
      </article>
    </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params;
  
  const prismic = getPrismicClient()

  const response = await prismic.getByUID('post', String(slug), {})
  
  const post = {
    slug,
    title: PrismicDom.RichText.asText(response.data.title),
    content: PrismicDom.RichText.asHtml(response.data.content.splice(0, 4)),
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