import { GetStaticProps } from 'next';
import Link from 'next/link';
import PrismicDom from 'prismic-dom'
import Prismic from '@prismicio/client'
import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss'

type Post = {
  slug: string,
  title: string,
  summary: string,
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.summary}</p>
              </a>
            </Link>
          ))}
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

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: PrismicDom.RichText.asText(post.data.title),
      summary: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}
