import { useEffect, useMemo, useState, useCallback } from 'react';
import * as anchor from '@project-serum/anchor';
import './home.css'
import styled from 'styled-components';
import { Container, Grid, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { BsDiscord, BsInstagram } from "react-icons/bs";
import { AiOutlineTwitter } from "react-icons/ai";
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import MainImg from './assets/images/gif2.gif'
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';
import { AlertState } from './utils';
import { Header } from './Header';
import { Footer } from './Footer';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 5px;
  background: #388087;
  color: white;
  box-shadow:none;
  font-size: 22px;
  padding: 30px 25px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection,
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true,
          );
        }

        if (status && !status.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
    <>

    <div className='main-container' >
    <div className='svg-bg' >
    <div className='cover-bg' >
      <Container>

        <Grid style={{padding:"9px"}}   container justifyContent='space-around' alignItems='center' >
        <Grid className='logo-img' item md={6} sm={3} xs={12} >
        <img  width="200px" src='https://www.alpacaland.io/assets/images/Logo.png' alt='logo' />
      </Grid>
        <Grid item md={5} sm={6} xs={12} >
          <ul className='nav-ul'>
            <li><a  href="https://www.alpacaland.io/#home" className='header-li-link'>Home</a></li>
            <li><a  href="https://www.alpacaland.io/#about" className='header-li-link'>About</a></li>
            <li><a  href="https://www.alpacaland.io/#roadmap" className='header-li-link'>Roadmap</a></li>
            <li><a  href="https://www.alpacaland.io/#faq" className='header-li-link'>FAQ</a></li>
            <li><a  href="https://www.alpacaland.io/#home" className='header-li-link' >
              <BsDiscord />
              </a></li>
            <li><a  href="https://www.alpacaland.io/#about" className='header-li-link'>
              <AiOutlineTwitter />
              
              </a></li>
            <li><a  href="https://www.alpacaland.io/#roadmap" className='header-li-link'>
            <BsInstagram />
              </a></li>
          </ul>
    </Grid>
    
    </Grid>
        <Grid className='grid-content'  container alignItems='center' >
        <Grid item xs={12} sm={10} md={6} className='text-grid'>
      <Container  >
      <p className='welcome-text'>Welcome to The Alpaca Land</p>
      <p className='inner-text'>
      6,888 algorithmically generated Alpacas wandering in the Solana Blockchain.
      </p>
        
          {!wallet.connected ? (
            <ConnectButton className='connect-btn'>Connect Wallet</ConnectButton>
            ) : (
              <>
              <Header candyMachine={candyMachine} />
              <MintContainer>
                {candyMachine?.state.isActive &&
                candyMachine?.state.gatekeeper &&
                wallet.publicKey &&
                wallet.signTransaction ? (
                  <GatewayProvider
                  wallet={{
                    publicKey:
                    wallet.publicKey ||
                    new PublicKey(CANDY_MACHINE_PROGRAM),
                    //@ts-ignore
                    signTransaction: wallet.signTransaction,
                  }}
                  gatekeeperNetwork={
                    candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                  }
                  clusterUrl={rpcUrl}
                  options={{ autoShowModal: false }}
                  >
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isUserMinting}
                      onMint={onMint}
                    />
                  </GatewayProvider>
                ) : (
                  <MintButton
                  candyMachine={candyMachine}
                  isMinting={isUserMinting}
                  onMint={onMint}
                  />
                  )}
              </MintContainer>
            </>
          )}

      </Container>
        </Grid>
      <Grid item xs={10} sm={10} md={4} style={{textAlign:"center"}}>

       
        <img className='main-img' style={{borderRadius:"10px"}} src={MainImg} alt='img' />

        </Grid>

        </Grid>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
        >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
          >
          {alertState.message}
        </Alert>
      </Snackbar>
      </Container>

    </div>
    </div>
    </div>

    <Footer />
          </>
  );
};

export default Home;
