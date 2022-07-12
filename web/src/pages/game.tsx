import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import protobuf from 'protobufjs';
import { withApollo } from '../utils/withApollo';
import { Layout } from "../components/Layout";
const { Buffer } = require('buffer/');
import dynamic from 'next/dynamic'
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import toast from 'react-hot-toast';
import { from } from '@apollo/client';
const Reacteroids = dynamic(() => import('../components/Reacteroids'), { ssr: false });
// import Reacteroids from '../components/Reacteroids';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        game: {
            overflow: "hidden"
        }
    })
);


const Game = () => {
    const classes = useStyles();
    const [size, setSize] = useState<{ width: number | undefined, height: number | undefined }>({
        height: undefined,
        width: undefined
    });

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            setSize({
                width: window.innerWidth - 50,
                height: window.innerHeight,
            });
        }
    }, []);

    return (
        <Layout>
            <div className={classes.game}>
                {size.height && size.width ?
                    <Reacteroids size={size} /> : null}
            </div>
        </Layout >
    );
};

export default withApollo({ ssr: false })(Game);
