import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { BsDiscord, BsInstagram } from 'react-icons/bs';
import { AiOutlineTwitter } from 'react-icons/ai';
import './Footer.css';
export const Footer = () => {
	return (
		<div className="footer-container">
			<Grid container direction="row" justifyContent="center" wrap="nowrap">
				<Grid xs={12}>
					<Container className="stay-text">Stay up to date with our project</Container>
					<Container className="join-text">Join our communities.</Container>
					<Container className="footer-links">
						<ul>
							<li>
								<a href="" className="footer-li-link">
									<BsDiscord />
								</a>
							</li>
							<li>
								<a href="" className="footer-li-link">
									<BsInstagram />
								</a>
							</li>
							<li>
								<a href="" className="footer-li-link">
									<AiOutlineTwitter />
								</a>
							</li>
						</ul>
					</Container>
					<Container className="copyright-text">
						<Container className="copyright"> Copyright © 2022, Alpaca Land.</Container>
						<Container className="trademark">
							All trademarks and copyrights belong to their respective owners.
						</Container>
						<h6 className="build-in">
							Built on the{' '}
							<img
								width="24px"
								src="https://www.alpacaland.io/assets/images/solana-sol-logo.svg"
								alt=""
							/>{' '}
							Solana blockchain.
						</h6>
					</Container>
				</Grid>
			</Grid>
		</div>
	);
};
