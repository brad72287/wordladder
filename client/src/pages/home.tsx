import { GameContainer } from '@/components/game/game-container';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Word Ladder - Transform words one letter at a time</title>
        <meta name="description" content="Play Word Ladder, a fun word puzzle game where you transform one word into another by changing just one letter at a time." />
      </Helmet>
      <GameContainer />
    </>
  );
}
