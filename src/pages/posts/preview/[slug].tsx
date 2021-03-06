import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link'
import Head from 'next/head'
import PrismicDom from 'prismic-dom'
import { getPrismicClient } from '../../../services/prismic';
import styles from '../post.module.scss'
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import router from 'next/router';

interface PostsPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}
export default function PostPreview({ post }: PostsPreviewProps) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [ session ])
  
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

        <div className={styles.continueReading}>
          Wanna continue reading?
          <Link href="/">
            <a href=""> Subscribe now 🤗</a>
          </Link>
        </div>
      </article>
    </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  
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
      },
      revalidate: 60 * 30 // 30 minutes
    }
  }